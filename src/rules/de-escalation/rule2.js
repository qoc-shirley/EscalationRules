import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as adjust from '../library/adjustICSDose';
import totalDoseReduction from '../library/totalDoseReduction';

const rule2 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, medication ) => {
      const rule = _.partial( ( medicationElement, originalMedications, patientMedication ) => {
        const filterMedications = _.chain( medicationElement )
          .filter( findMedication => (
              !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
              findMedication.name === 'flovent' &&
              findMedication.device === 'inhaler2'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
                  findMedication.name === 'flovent' &&
                  findMedication.device === 'diskus'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
                findMedication.name === 'pulmicort' &&
                findMedication.device === 'turbuhaler'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'qvar' &&
                findMedication.device === 'inhaler1'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'asthmanex' &&
                findMedication.device === 'twisthaler'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToDose( findMedication, 200 ) ) &&
                findMedication.name === 'alvesco' &&
                findMedication.device === 'inhaler1'
              )
              ||
              (
                !_.isNil( adjust.ICSDoseToDose( findMedication, 100 ) ) &&
                findMedication.name === 'arnuity' &&
                findMedication.device === 'inhaler2'
              ) )
          .value();

        const compareLowestDose = _.chain( filterMedications )
          .filter(
          {
            chemicalType: patientMedication.chemicalType,
            name: patientMedication.name,
            device: patientMedication.device,
          } )
          .value();
        const noLabaLtra = _.chain( originalMedications )
          .filter( _noMedication => _noMedication.chemicalType === 'laba' || _noMedication.chemicalType === 'ltra' )
          .isEmpty()
          .value();
        console.log('compareLowestDose: ', compareLowestDose);
        if ( patientMedication.chemicalType === 'ICS' &&
          noLabaLtra &&
          !_.isEmpty( _.filter( compareLowestDose,
            _medication => calculate.patientICSDose( patientMedication ) > calculate.ICSDose( _medication ) ) ) ) {
          console.log('in');
          const recommend = _.chain( compareLowestDose )
            .filter( _recommendMedication => _recommendMedication.chemicalICS === patientMedication.chemicalICS &&
              _recommendMedication.device === patientMedication.device )
            .value();
          result.push( totalDoseReduction( patientMedication, recommend ) );
        }

        return result;
      }, masterMedications, patientMedications );
      rule( medication );

      return result;
    }, [] )
    .value();

export default rule2;
