/* eslint-disable no-param-reassign */
import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const rule5 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          // console.log('master medications: ', _masterMedications);
          const originalMedicationLtra = _.filter( _patientMedications, { chemicalType: 'ltra' } );
          const originalMedicationLaba = _.filter( _patientMedications, { chemicalType: 'laba' } );
          const filterOrgMeds = _.filter( _patientMedications, medication => medication.name !== 'symbicort' &&
              (
                medication.chemicalType === 'laba' ||
                ( medication.chemicalType === 'ICS' &&
                  calculate.patientICSDose( medication ) < _.toInteger( medication.maxGreenICS ) )
              ) );
          const isLaba = _.filter( filterOrgMeds, { chemicalType: 'laba' } );
          if ( patientMedication.chemicalType === 'laba,ICS' && patientMedication.name !== 'symbicort' &&
               calculate.patientICSDose( patientMedication ) < _.toInteger( patientMedication.maxGreenICS ) &&
           !_.isEmpty( originalMedicationLtra ) &&  !_.some( _patientMedications, { chemicalType: 'laac' } ) ) {
            const recommendHighest = _.chain( _masterMedications )
              .filter( sameMedication => sameMedication.chemicalType === patientMedication.chemicalType &&
                  sameMedication.name === patientMedication.name &&
                  sameMedication.device === patientMedication.device )
              .filter( adjustToMax =>
                 adjust.ICSDose( adjustToMax, 'highest' ) !== [] )
              .thru( _medication => match.minimizePuffsPerTime( _medication ) )
              .thru( _medication => Object.assign( _medication, { tag: 'e13' } ) )
              .value();
            // console.log('recommendHighest: ', recommendHighest);
            result.push( Object.assign( originalMedicationLtra[0], { tag: 'e13' } ) );
            if ( _.isEmpty( recommendHighest ) ) {
              return result.push( _.chain( _masterMedications )
                .filter( medication => medication.chemicalType === 'laba,ICS' &&
                    ( adjust.ICSDose( medication, 'highest' ) !== [] ) &&
                    medication.device === patientMedication.device )
                .reduce( ( accResult, medication ) => {
                  if ( _.isNil( accResult.high ) ) {
                    return Object.assign(
                      accResult,
                      {
                        high: medication,
                      },
                    );
                  }
                  else if ( accResult.high.doseICS <= medication.doseICS ) {
                    return Object.assign(
                      accResult,
                      {
                        high: medication,
                      },
                    );
                  }

                  return accResult;
                }, [] )
                .thru( medication => medication.high )
                .thru( medication => adjust.ICSDose( medication, 'highest' ) )
                .thru( _medication => Object.assign( _medication, { tag: 'e13' } ) )
                .value(),
              );
            }
            result.push( Object.assign( recommendHighest, { tag: 'e13' } ) );

            return result;
          }
          else if ( ( patientMedication.chemicalType === 'ICS' &&
                      calculate.patientICSDose( patientMedication ) < _.toInteger( patientMedication.maxGreenICS ) ) &&
                    !_.isEmpty( isLaba ) && !_.isEmpty( originalMedicationLtra ) &&
                    !_.some( _patientMedications, { chemicalType: 'laac' } )
                  ) {
            const laba = _.find( isLaba, { chemicalType: 'laba' } );
            const filteredMedication = _.chain( _masterMedications )
              .filter( masterMedication => masterMedication.chemicalType === 'laba,ICS' &&
                  masterMedication.chemicalICS === patientMedication.chemicalICS &&
                 !_.isEmpty(
                   _.filter( isLaba, medication => masterMedication.chemicalLABA === medication.chemicalLABA ) )
              )
              .value();

            const isfilteredMedicationDevice = _.chain( filteredMedication )
              .filter( medication => medication.device === patientMedication.device ||
                  medication.device === laba.device )
              .value();
            if ( _.isEmpty( filteredMedication ) || _.isEmpty( isfilteredMedicationDevice ) ) {
              result.push(
                [
                  Object.assign( originalMedicationLtra[0], { tag: 'e15' } ),
                  Object.assign( originalMedicationLaba[0], { tag: 'e15' } )] );

              console.log('patientMedication: ', adjust.ICSDose( patientMedication, 'highest' ) );
              if ( !_.isEmpty( adjust.ICSDose( patientMedication, 'highest' ) ) ) {
                const adjustToMax = adjust.ICSDose( patientMedication, 'highest' );

                return result.push( Object.assign( adjustToMax, { tag: 'e15' } ) );
              }

              return result.push(
                _.chain( _masterMedications )
                  .filter( medication =>{
                  return medication.chemicalType === 'ICS' &&
                      medication.name === patientMedication.name &&
                      !_.isEmpty( adjust.ICSDose( medication, 'highest' ) ) &&
                      ( _.toInteger( medication.timesPerDay ) === _.toInteger( patientMedication.timesPerDay ) ||
                        medication.timesPerDay === '1 OR 2' ) &&
                      ( medication.device === patientMedication.device || medication.device === laba.device ) })
                  .reduce( ( accResult, medication ) => {
                    console.log('filteredMEdication: ', medication);
                    if ( _.isEmpty( accResult ) ) {
                      accResult = medication;
                      console.log('nil: ', accResult);

                      return accResult;
                    }
                    else if ( accResult.doseICS <= medication.doseICS ) {
                      accResult = medication;
                      console.log('replace or not: ', accResult);

                      return accResult;
                    }
                    console.log('otherwise: ', accResult);

                    return accResult;
                  }, [] )
                  .thru( medication => { console.log('medication.high: ', medication ); return medication } )
                  .thru( _medication => Object.assign( _medication, { tag: 'e15' } ) )
                  .value(),
              );
            }
            result.push( _.chain( isfilteredMedicationDevice )
              .filter( toMax => adjust.ICSDose( toMax, 'highest' ) !== [] )
              .thru( _medication => Object.assign( _medication, { tag: 'e14' } ) )
              .thru( _medication => match.minimizePuffsPerTime( _medication ) )
              .value(),
            );
            result.push( Object.assign( originalMedicationLtra[0], { tag: 'e14' } ) );

            return result;
          }
          else if ( patientMedication.name === 'symbicort' && patientMedication.isSmart === false &&
            _.some( _patientMedications, { chemicalType: 'ltra' } ) &&
            !_.some( _patientMedications, { chemicalType: 'laac' } ) ) {
            result.push( [
              Object.assign( patientMedication, { tag: 'e16', isSmart: true } ),
              Object.assign( originalMedicationLtra[0], { tag: 'e16' } )],
            );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( originalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .uniqBy( 'id' )
    .value();

export default rule5;
