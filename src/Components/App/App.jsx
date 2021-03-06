import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../../medicationData/medicationData';
import DisplayPatientMedications from '../Display/PatientMedications/PatientMedications';
import Recommendations from '../Display/Recommendations/Recommendations';
import Questionnaire from '../Questionnaire/Questionnaire';
import * as getEscalation from '../../rules/escalation/rules';
import * as getDeEscalation from '../../rules/de-escalation/rules';
import './styles.css';

const App = ( {
appendMedicationList,
medication,
onMedicationSelection,
onChangePuffValue,
onChangeTimesPerDayValue,
onChangeDoseICS,
onClickClear,
onDeleteRow,
saveRecommendation,
} ) => {
  let showPatientMedications = null;
  if ( medication.isRecommendationEmpty === false ) {
    showPatientMedications = <DisplayPatientMedications />;
  }
  else if ( medication.isRecommendationEmpty === true ) {
    showPatientMedications = null;
  }

  const newMasterMedications = _.chain( medicationData )
    .map( medicationRow => _.chain( medicationRow )
      .mapValues( ( element ) => {
        if ( element === '.' ) {
          return '';
        }

        return element;
      } )
      .value(),
    )
    .value();
  console.log( 'newMasterMedications: ', newMasterMedications );

  const escalationRules = () => {
    const clonedMasterMedication1 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication2 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication3 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication4 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication5 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication6 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication7 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication8 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication9 = _.cloneDeep( newMasterMedications );
    const clonedPatientMedication1 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication2 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication3 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication4 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication5 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication6 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication7 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication8 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication9 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication10 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication11 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication12 = _.cloneDeep( medication.patientMedications );

    saveRecommendation( 'Rule -1', getEscalation.rules.ruleMinus1( clonedPatientMedication1 ) );
    saveRecommendation( 'Rule 0', getEscalation.rules.rule0( clonedPatientMedication2, clonedMasterMedication3 ) );
    saveRecommendation( 'Rule 1', getEscalation.rules.rule1( clonedPatientMedication3, clonedMasterMedication4 ) );
    saveRecommendation( 'Rule 3', getEscalation.rules.rule3( clonedPatientMedication4, clonedMasterMedication5 ) );
    saveRecommendation( 'Rule 4',
      getEscalation.rules.rule4( clonedPatientMedication5, clonedMasterMedication1 ) );
    saveRecommendation( 'Rule 5', getEscalation.rules.rule5( clonedPatientMedication6, clonedMasterMedication2 ) );
    saveRecommendation( 'Rule 6', getEscalation.rules.rule6( clonedPatientMedication7 ) );
    saveRecommendation( 'Rule 7', getEscalation.rules.rule7( clonedPatientMedication8, clonedMasterMedication8 ) );
    saveRecommendation( 'Rule 8', getEscalation.rules.rule8( clonedPatientMedication9, clonedMasterMedication6 ) );
    saveRecommendation( 'Rule 9', getEscalation.rules.rule9( clonedPatientMedication10, clonedMasterMedication9 ) );
    saveRecommendation( 'Rule 10', getEscalation.rules.rule10( clonedPatientMedication11 ) );
    saveRecommendation( 'Rule 11',
      getEscalation.rules.rule11( clonedPatientMedication12, clonedMasterMedication7 ) );
  };

  // const breoTestCase1 = [{ id: 46,
  //   device: 'ellipta',
  //   function: 'controller',
  //   name: 'arnuity',
  //   chemicalType: 'ICS',
  //   chemicalLABA: '.',
  //   chemicalICS: 'fluticasone furoate',
  //   doseICS: 200,
  //   maxGreenICS: 200,
  //   lowCeilICS: 199,
  //   highFloorICS: 201,
  //   timesPerDay: 1,
  //   puffPerTime: 2,
  //   maxPuffPerTime: 1 }];

  // const zenhaleCase1 = [{ id: 38,
  //   device: 'inhaler2',
  //   function: 'controller',
  //   name: 'zenhale',
  //   chemicalType: 'laba,ICS',
  //   chemicalLABA: 'formoterol',
  //   chemicalICS: 'mometasone',
  //   doseICS: 200,
  //   maxGreenICS: 800,
  //   lowCeilICS: 399,
  //   highFloorICS: 801,
  //   timesPerDay: 5,
  //   puffPerTime: 5,
  //   maxPuffPerTime: 4 }];

  const deescalationRules = () => {
    const clonedMasterMedication1 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication2 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication3 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication4 = _.cloneDeep( newMasterMedications );
    const clonedMasterMedication5 = _.cloneDeep( newMasterMedications );
    const clonedPatientMedication1 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication2 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication3 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication4 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication5 = _.cloneDeep( medication.patientMedications );
    const clonedPatientMedication6 = _.cloneDeep( medication.patientMedications );

    const asthmaControlAnswers = [
      {
        wakeUp: medication.wakeUp,
        asthmaSymptoms: medication.asthmaSymptoms,
        rescuePuffer: medication.rescuePuffer,
        missedEvent: medication.missedEvent,
        stoppedExercising: medication.stoppedExercising,
      }];
    getDeEscalation.rules.control( asthmaControlAnswers );
    saveRecommendation( 'Rule -1',
      getDeEscalation.rules.ruleMinus1( clonedPatientMedication1, asthmaControlAnswers ) );
    saveRecommendation(
      'Rule 1',
      getDeEscalation.rules.rule1( clonedPatientMedication2, clonedMasterMedication1, asthmaControlAnswers ) );
    saveRecommendation(
      'Rule 2',
      getDeEscalation.rules.rule2( clonedPatientMedication3, clonedMasterMedication2 ) );
    saveRecommendation(
      'Rule 3',
      getDeEscalation.rules.rule3(
        clonedPatientMedication4,
        clonedMasterMedication3, asthmaControlAnswers,
      ) );
    saveRecommendation(
      'Rule 4',
      getDeEscalation.rules.rule4( clonedPatientMedication5, clonedMasterMedication4, asthmaControlAnswers ) );
    saveRecommendation(
      'Rule 5',
      getDeEscalation.rules.rule5( clonedPatientMedication6, clonedMasterMedication5, asthmaControlAnswers ) );
  };

  const clearRecommendations = () => {
    onClickClear();
  };

  const showAvailableRules = () => {
    if ( medication.isRecommendationEmpty === false ) {
      return (
        <div className="rules">
          <button
            className="button__runRules"
            onClick={() => escalationRules()}
          >
            Escalation
          </button>
          <button
            className="button__runRules"
            onClick={() => deescalationRules()}
          >
            De-escalation
          </button>
          <input
            className="clear"
            type="submit"
            value="Clear"
            onClick={clearRecommendations}
          />
        </div>
      );
    }
    else if ( medication.isRecommendationEmpty === true ) {
      return null;
    }

    return null;
  };

  const showRecommendation = () => {
    if ( medication.isRuleSelectEmpty === false ) {
      return (
        <div className="displayRecommendations">
          <Recommendations />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app">
      <div className="app__header">
        <Header />
      </div>
      <div className="app__main">
        <Questionnaire />
        <MedicationTable
          onChangeMedication={onMedicationSelection}
          onChangePuffValue={onChangePuffValue}
          onChangeTimesPerDayValue={onChangeTimesPerDayValue}
          onChangeDoseICS={onChangeDoseICS}
          appendMedicationList={appendMedicationList}
          medicationList={medication.medicationList}
          onClickDeleteMedication={onDeleteRow}
        />
        <div className="results">
          {showPatientMedications}
          {showAvailableRules()}
        </div>
        {showRecommendation()}
      </div>
    </div>
  );
};

App.PropTypes = {
  appendMedicationList: PropTypes.func,
  medication: PropTypes.array,
  medicationList: PropTypes.array,
  onChangeDoseICS: PropTypes.func,
  onMedicationSelection: PropTypes.func,
  onChangePuffValue: PropTypes.func,
  onChangeTimesPerDayValue: PropTypes.func,
  onDeleteRow: PropTypes.func,
  saveRecommendation: PropTypes.func,
};

App.defaultProps = {
  medicationList: [],
};
export default App;
