import _ from 'lodash';
import * as get from '../library/getICSDose';

const rule0 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, originalMedication ) => {
      const rule = _.partial( ( _masterMedications, patientMedication ) => {
        if ( patientMedication.chemicalType !== 'ICS' && patientMedication.chemicalType !== 'laba,ICS' ) {
          if (
            ( patientMedication.chemicalType === 'laba' )
            && ( _.some( _masterMedications, { chemicalType: 'laba,ICS' } ) )
          ) {
            const isLabaICSAndChemicalLABA = _.chain( _masterMedications )
              .filter( {
                chemicalType: 'laba,ICS',
                chemicalLABA: patientMedication.chemicalLABA,
              } )
              .isEmpty()
              .value();
            console.log('isLabaICSAndChemicalLABA: ',isLabaICSAndChemicalLABA);
            if ( patientMedication.chemicalType === 'laba' && !isLabaICSAndChemicalLABA ) {
              return result.push( _.chain( _masterMedications )
                .filter( {
                  chemicalType: 'laba,ICS',
                  chemicalLABA: patientMedication.chemicalLABA,
                  device: patientMedication.device,
                } )
                .thru( ( results ) => {
                  console.log('results: ', results);
                  if ( !_.isEmpty( results ) ) {
                    return _.chain( _masterMedications )
                      .filter( {
                        chemicalType: 'laba,ICS',
                        chemicalLABA: patientMedication.chemicalLABA,
                        device: patientMedication.device,
                      } )
                      .value();
                  }
                  else {
                    console.log('results empty');
                    return _.chain( _masterMedications )
                      .filter( {
                        chemicalType: 'laba,ICS',
                        chemicalLABA: patientMedication.chemicalLABA,
                      } )
                      .value();
                  }
                } )
                .thru( get.lowestICSDose )
                .thru(
                  ( medication ) => {
                    return Object.assign( {}, medication,
                      { maxPuffPerTime: 1 },
                      );
                  } )
                .value(),
              );
            }
            else {
              const newMedications = _.chain( _masterMedications )
                .reduce( ( recommend, medication ) => {
                  if ( medication.chemicalLABA === 'salmeterol' &&
                    medication.chemicalICS === 'fluticasone' &&
                    medication.device === 'diskus' ) {
                    recommend.push( medication );
                  }
                  if ( medication.chemicalLABA === 'salmeterol' &&
                    medication.chemicalICS === 'fluticasone' &&
                    medication.device === 'inhaler2' ) {
                    recommend.push( medication );
                  }
                  if ( medication.chemicalLABA === 'formoterol' && medication.chemicalICS === 'budesonide' ) {
                    recommend.push( medication );
                  }
                  if ( medication.chemicalLABA === 'formoterol' && medication.chemicalICS === 'mometasone' ) {
                    recommend.push( medication );
                  }

                  return recommend;
                }, [] )
                .value();

              const lowestICSDose = get.lowestICSDose( newMedications );
              result.push( Object.assign( {}, lowestICSDose, { maxPuffPerTime: 1 } ) );
            }
          }
          else {
            console.log('patientMedication: ', patientMedication);
            const recommendationOne = _.chain( _masterMedications )
              .filter( { name: 'flovent', doseICS: '125' } )
              .thru( ( changeOne ) => {
                return _.map( changeOne, ( changeOneEach ) => {
                  return Object.assign( changeOneEach, { maxPuffPerTime: 1 } );
                } );
              } )
              .value();
            const recommendationTwo = _.chain( _masterMedications )
              .filter( { device: 'diskus', doseICS: '100' } )
              .thru( ( changeTwo ) => {
                return _.map( changeTwo, ( changeTwoEach ) => {
                  return Object.assign( changeTwoEach, { maxPuffPerTime: 1 } );
                } );
              } )
              .value();
            const recommendationThree =  _.chain( _masterMedications )
              .filter( { name: 'pulmicort', doseICS: '200' } )
              .thru( ( changeThree ) => {
                return _.map( changeThree, ( changeThreeEach ) => {
                  return Object.assign( changeThreeEach, { maxPuffPerTime: 1 } );
                } );
              } )
              .value();
            const recommendationFour = _.chain( _masterMedications )
              .filter( { name: 'asmanex', doseICS: '200' } )
              .thru( ( changeFour ) => {
                return _.map( changeFour, ( changeFourEach ) => {
                  return Object.assign( changeFourEach, { maxPuffPerTime: 1 } );
                } );
              } )
              .value();
            const recommendationFive = _.chain( _masterMedications )
              .filter( { name: 'alvesco', doseICS: '200' } )
              .thru( ( changeFive ) => {
                return _.map( changeFive, ( changeFiveEach ) => {
                  return Object.assign( changeFiveEach, { maxPuffPerTime: 1 } );
                } );
              } )
              .value();
            const recommendationSix =  _.chain( _masterMedications )
              .thru( ( changeSix ) => {
                return _.map( changeSix, ( changeSixEach ) => {
                  return Object.assign( changeSixEach, { maxPuffPerTime: 1 } );
                } );
              } )
              .filter( { name: 'qvar', doseICS: '100' } )
              .value();

            result.push( 'Options: ',
              recommendationOne,
              recommendationTwo,
              recommendationThree,
              recommendationFour,
              recommendationFive,
              recommendationSix,
              );
          }
        }

        if ( patientMedication.chemicalType === 'ltra' ) {
          result.push( patientMedication );
        }
      }, masterMedications );
      rule( originalMedication );

      return result;
    }, [] )
    .flatten()
    .value();
};

export default rule0;
