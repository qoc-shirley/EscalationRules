import _ from 'lodash';
import * as get from '../library/getICSDose';
import * as calculate from '../library/calculateICSDose';
import totalDoseReduction from '../library/totalDoseReduction';

const rule2 = ( patientMedications, masterMedications ) => {
  return _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
        console.log("start");
        const filterMedications = _.chain( medicationElement )
          .filter( ( findMedication ) => {
            return (
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '100'
            ) || (
              findMedication.name === 'flovent' &&
              findMedication.device === 'diskus' &&
              findMedication.doseICS === '200'
            ) || (
              findMedication.name === 'pulmicort' &&
              findMedication.device === 'turbuhaler' &&
              findMedication.doseICS === '200'
            ) || (
              findMedication.name === 'qvar' &&
              findMedication.device === 'inhaler1' &&
              findMedication.doseICS === '100'
            ) || (
              findMedication.name === 'asthmanex' &&
              findMedication.device === 'twisthaler' &&
              findMedication.doseICS === '100'
            ) || (
              findMedication.name === 'alvesco' &&
              findMedication.device === 'inhaler1' &&
              findMedication.doseICS === '200'
            ) || (
              findMedication.name === 'arnuity' &&
              findMedication.device === 'inhaler2' &&
              findMedication.doseICS === '100'
            );
          } )
          .value();

        const compareLowestDose = _.chain( filterMedications )
          .thru( get.lowestICSDose )
          .value();
        console.log("compareLowestDose:", compareLowestDose);
        const noLabaLtra = _.chain( originalMedications )
          .filter( ( medication ) => {
            return medication.chemicalType === 'laba' || medication.chemicalType === 'ltra';
          } )
          .isEmpty()
          .value();

        if ( patientMedication.chemicalType === 'ICS' &&
          noLabaLtra &&
          calculate.patientICSDose( patientMedication ) > 100 /* calculate.ICSDose( compareLowestDose ) */ ) {
          console.log("totalDoseReduction");
          const recommend = _.chain( medicationElement )
            .filter( ( medication ) => {
              return medication.chemicalICS === patientMedication.chemicalICS &&
                medication.device === patientMedication.device;
            } )
            .value();
          console.log("recommend: ", recommend);

          result.push( totalDoseReduction( patientMedication, recommend ) );
          console.log("result: ", result);
        }

        return result;
      }, masterMedications, patientMedications );
      rule( medication );

      return result;
    }, [] )
    .value();
};

export default rule2;
