import _ from 'lodash';
import * as get from './library/getICSDose';

const addToRecommendations = ( elements ) => {
  return _.chain( elements )
    .reduce( ( recommend, addElement ) => {
      recommend.push( addElement );

      return recommend;
    }, [] )
    .value();
};

const rule0 = ( patientMedications, masterMedications ) => {
  const result = [];

  return _.chain( patientMedications )
    .filter(
      _.partial( ( medicationElement, patientMedication ) => {
        if ( patientMedication.chemicalType !== 'ICS' && patientMedication.chemicalType !== 'laba,ICS' ) {

          if (
            ( patientMedication.chemicalType === 'laba' )
            && ( _.some( medicationElement, { chemicalType: 'laba,ICS' } ) )
          ) {

            const isLabaICSAndChemicalLABA = _.chain( medicationElement )
              .filter( {
                chemicalType: 'laba,ICS',
                chemicalLABA: patientMedication.chemicalLABA,
              } )
              .isEmpty()
              .value();

            if ( !isLabaICSAndChemicalLABA ) {

              const isChemicalLABAAndDeviceEqual = _.chain( medicationElement )
                .filter( {
                  chemicalType: 'laba,ICS',
                  chemicalLABA: patientMedication.chemicalLABA,
                  device: patientMedication.device,
                } )
                .isEmpty()
                .value();

              if ( !isChemicalLABAAndDeviceEqual ) {

                const newMedications = _.filter( medicationElement, {
                  chemicalType: 'laba,ICS',
                  chemicalLABA: patientMedication.chemicalLABA,
                  device: patientMedication.device,
                } );

                const lowestICSDose = get.lowestICSDose( newMedications );
                result.push( addToRecommendations( lowestICSDose ) );
              }
              else {
                const newMedications = _.filter( medicationElement, {
                  chemicalType: 'laba,ICS',
                  chemicalLABA: patientMedication.chemicalLABA,
                } );

                const lowestICSDose = get.lowestICSDose( newMedications );
                result.push( addToRecommendations( lowestICSDose ) );
              }
            }
            else {
              const newMedications = _.chain( medicationElement )
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
                  if ( medication.chemicalLABA === 'formoterol' && medication.chemicalICS === 'budesonide') {
                    recommend.push( medication );
                  }

                  return recommend;
                }, [] )
                .value();

              const lowestICSDose = get.lowestICSDose( newMedications );
              result.push( addToRecommendations( lowestICSDose ) );
            }
          }
          else {

            result.push(
              {
                id: '*',
                device: '-',
                name: 'Flovent',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '125 ug 1 Puff Bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: 'Or *',
                device: 'Discus',
                name: '-',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '100 ug 1 PUFF puff bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'Pulmicort',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '200 ug 1 PUFF bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'Asmanex',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '200 ug I PUFF od',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'Alvesco',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '200 ug I PUFF od',
                puffPerTime: '-',
                timesPerDay: '-',
              },
              {
                id: '-',
                device: '-',
                name: 'QVAR',
                chemicalLABA: '-',
                chemicalICS: '-',
                doseICS: '100 I PUFF ug bid',
                puffPerTime: '-',
                timesPerDay: '-',
              },
            );
          }
        }

        if ( patientMedication.chemicalType === 'ltra' ) {
          result.push( patientMedication );
        }
      }, masterMedications ) )
    .concat( result )
    .value();
};

export default rule0;
