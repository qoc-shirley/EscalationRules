import _ from 'lodash';
import * as calculate from '../library/calculateICSDose';
import * as categorize from '../library/categorizeDose';
import * as adjust from '../library/adjustICSDose';
import * as match from '../library/match';

const rule1 = ( patientMedications, masterMedications ) => _.chain( patientMedications )
    .reduce( ( result, patientOriginalMedication ) => {
      const rule =
        _.partial( ( _masterMedications, _patientMedications, patientMedication ) => {
          const newMedications = _.filter( _masterMedications, { chemicalType: 'laba,ICS' } );
          const onlyICS = _.chain( _patientMedications )
            .filter( _medication =>
              _medication.chemicalType === 'laba' ||
              _medication.chemicalType === 'saba' ||
              _medication.chemicalType === 'laac' ||
              _medication.chemicalType === 'laba,ICS',
            )
            .isEmpty()
            .value();
          if ( patientMedication.chemicalType === 'ICS' && !_.isEmpty( newMedications ) && onlyICS ) {
            // talk to lili
            if ( _.some( _patientMedications, { chemicalType: 'ltra' } ) ) {
              result.push( _.chain( _patientMedications )
                .filter( { chemicalType: 'ltra' } )
                .thru( _medications => Object.assign( _medications, { tag: '' } ) )
                .value(),
              );
            }
            let chemicalICSMedications = _.chain( newMedications )
              .filter( { chemicalICS: patientMedication.chemicalICS, device: patientMedication.device } )
              .value();
            if ( _.isEmpty( chemicalICSMedications ) ) {
              chemicalICSMedications =  _.chain( newMedications )
                .filter( { chemicalICS: patientMedication.chemicalICS } )
                .value();
            }
            console.log('chemicalICSMedications: ', chemicalICSMedications);
            const equal = _.chain( chemicalICSMedications )
              .filter( medication => !_.isEmpty( adjust.ICSDoseToOriginalMedication( medication, patientMedication ) ) )
              .value();
            console.log('equal: ', equal);
            if ( !_.isEmpty( chemicalICSMedications ) ) {
              let toMax = [];
              let toNext = [];
              let checkNewMedication;
              if ( !_.isEmpty( equal ) ) {
                checkNewMedication = _.chain( equal )
                  .reduce( ( accResult, medication ) => {
                    if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                      console.log('newMedAdjust greater: ', newMedAdjust);
                      if ( _.isEmpty( toMax ) ||
                        ( toMax.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        toMax = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }
                    }
                    else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                      console.log('newMedAdjust smaller: ', newMedAdjust);
                      if ( _.isEmpty( toNext ) ||
                        ( toNext.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        // ICS DOSE is same but doseICS is greater than the one stored
                        toNext = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }

                      return accResult;
                    }
                    console.log('medication: ', medication);

                    return medication;
                  }, [] )
                  .thru( _medication => Object.assign( _medication, { tag: 'e4' } ) )
                  .value();
                if ( _.isEmpty( checkNewMedication ) ) {
                  checkNewMedication = _.chain( chemicalICSMedications )
                    .reduce( ( accResult, medication ) => {
                      if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                        const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                        console.log('newMedAdjust greater: ', newMedAdjust);
                        if ( _.isEmpty( toMax ) ||
                          ( toMax.doseICS < newMedAdjust.doseICS &&
                            calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                          toMax = Object.assign( newMedAdjust, { tag: 'e4' } );

                          return accResult;
                        }
                      }
                      else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                        const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                        console.log('newMedAdjust smaller: ', newMedAdjust);
                        if ( _.isEmpty( toNext ) ||
                          ( toNext.doseICS < newMedAdjust.doseICS &&
                            calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                          // ICS DOSE is same but doseICS is greater than the one stored
                          toNext = Object.assign( newMedAdjust, { tag: 'e4' } );

                          return accResult;
                        }

                        return accResult;
                      }
                      console.log('medication: ', medication);

                      return medication;
                    }, [] )
                    .thru( _medication => Object.assign( _medication, { tag: 'e4' } ) )
                    .value();
                }
              }
              else if ( _.isEmpty( equal ) ) {
                console.log(' equal empty: ', chemicalICSMedications);
                checkNewMedication = _.chain( chemicalICSMedications )
                  // .filter( { device: patientMedication.device } )
                  .reduce( ( accResult, medication ) => {
                    // console.log( 'patientMedication newMedication: ', patientMedication, medication );
                    if ( calculate.patientICSDose( patientMedication ) > calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSDose( medication, 'highest' );
                      console.log('newMedAdjust: ', newMedAdjust);
                      if ( _.isEmpty( toMax ) ||
                        ( toMax.doseICS < newMedAdjust.doseICS &&
                        calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        toMax = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }
                    }
                    else if ( calculate.patientICSDose( patientMedication ) < calculate.ICSDose( medication ) ) {
                      const newMedAdjust = adjust.ICSHigherNext( medication, patientMedication );
                      if ( _.isEmpty( toNext ) ||
                        ( toNext.doseICS < newMedAdjust.doseICS &&
                          calculate.ICSDose( toNext ) === calculate.ICSDose( newMedAdjust ) ) ) {
                        // ICS DOSE is same but doseICS is greater than the one stored
                        toNext = Object.assign( newMedAdjust, { tag: 'e4' } );

                        return accResult;
                      }

                      return accResult;
                    }

                    return medication;
                  }, [] )
                  .thru( _medication => Object.assign( _medication, { tag: 'e4' } ) )
                  .value();
              }
              const minimization = match.minimizePuffsPerTime( [checkNewMedication, toMax, toNext] );

              return result.push( minimization );
            }
            const category = categorize.patientICSDose( patientMedication );

            return result.push( _.chain( _masterMedications )
              .reduce( ( accNewMedications, medication ) => {
                if ( medication.chemicalLABA === 'salmeterol' &&
                  medication.chemicalICS === 'fluticasone' &&
                  medication.device === 'diskus' ) {
                  accNewMedications.diskus.push( Object.assign( medication, { tag: 'e5' } ) );
                }
                else if ( medication.chemicalLABA === 'salmeterol' &&
                  medication.chemicalICS === 'fluticasone' &&
                  medication.device === 'inhaler2' ) {
                  accNewMedications.inhaler2Advair.push( Object.assign( medication, { tag: 'e5' } ) );
                }
                else if ( medication.chemicalLABA === 'formoterol' &&
                  medication.chemicalICS === 'budesonide' ) {
                  accNewMedications.inhaler2Zenhale.push( Object.assign( medication, { tag: 'e5' } ) );
                }
                else if ( medication.chemicalLABA === 'formoterol' &&
                  medication.chemicalICS === 'mometasone' ) {
                  accNewMedications.symbicort.push( Object.assign( medication, { tag: 'e5' } ) );
                }

                return accNewMedications;
              }, { diskus: [], inhaler2Advair: [], inhaler2Zenhale: [], symbicort: [] } )
              .map( ( _newMedications ) => {
                console.log('newMedications: ', _newMedications );
                if ( category === 'excessive' ) {
                  const findLowestOrHighestMedication = _.chain( _newMedications )
                    .filter( _medication => categorize.ICSDose( _medication ) === category &&
                      !_.isEmpty( adjust.ICSDose( _medication, 'highest' ) ) )
                    .thru( _medication => match.minimizePuffsPerTime( _medication ) )
                    .value();
                  if ( _.isEmpty( findLowestOrHighestMedication ) ) {
                    return _.chain( _newMedications )
                      .filter( _medication => !_.isEmpty( adjust.ICSDose( _medication, 'highest' ) ) )
                      .value();
                  }
                }
                const findLowestOrHighestMedication = _.chain( _newMedications )
                  .filter( _medication => categorize.ICSDose( _medication ) === category &&
                    !_.isEmpty(adjust.ICSDose( _medication, category ) ) )
                  .minBy( _medication => calculate.patientICSDose( _medication ) )
                  .value();
                if ( _.isEmpty( findLowestOrHighestMedication ) ) { // try to return the lowest ICS DOSE
                  return _.chain( _newMedications )
                    .filter( _medication => !_.isEmpty(adjust.ICSDose( _medication, category ) ) )
                    .minBy( _medication => calculate.patientICSDose( _medication ) )
                    .value();
                }

                return findLowestOrHighestMedication;
              } )
              .value(),
            );
          }

          return result;
        }, masterMedications, patientMedications );

      rule( patientOriginalMedication );

      return result;
    }, [] )
    .flattenDeep()
    .value();
export default rule1;
