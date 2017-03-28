require 'rails_helper'

describe SubmitForm::SwitchBasedCheckOut do

  def subject(data)
    SubmitForm::SwitchBasedCheckOut::Main.run(data)
  end

  let!(:at_t) { FactoryGirl.create(:assignment_type, name: 'team') }
  let!(:at_r) { FactoryGirl.create(:assignment_type, name: 'route') }
  let!(:switch) { FactoryGirl.create(:switch_based_check_out, name: 'Route by Team', target_assignment_type_id: at_r.id, helper_assignment_type_id: at_t.id)}

  let!(:at_ft) { FactoryGirl.create(:assignment_type, name: 'formType') }
  let!(:at_ftc) { FactoryGirl.create(:assignment_type, name: 'formTypeCategory') }
  let!(:t_to_r) { FactoryGirl.create(:assignment_relation_type, assignment_1_type: at_t, assignment_2_type: at_r)}

  let!(:team_1) { FactoryGirl.create(:assignment, name: 'team_1', assignment_type: at_t)}
  let!(:route_1) { FactoryGirl.create(:assignment, name: 'route_1', assignment_type: at_r)}
  let!(:route_2) { FactoryGirl.create(:assignment, name: 'route_2', assignment_type: at_r)}

  let!(:t1_r1) { FactoryGirl.create(:assignment_relation, assignment_1: team_1, assignment_2: route_1, assignment_relation_type: t_to_r) }
  let!(:t1_r2) { FactoryGirl.create(:assignment_relation, assignment_1: team_1, assignment_2: route_2, assignment_relation_type: t_to_r) }

  let!(:ff_ft) { FactoryGirl.create(:form_field, name: 'formType', field_type: 'assignment', assignment_type: at_ft) }
  let!(:ff_ftc) { FactoryGirl.create(:form_field, name: 'formTypeCategory', field_type: 'assignment', assignment_type: at_ftc) }
  let!(:ff_r) { FactoryGirl.create(:form_field, name: 'route', field_type: 'assignment', assignment_type: at_r)}
  let!(:ff_t) { FactoryGirl.create(:form_field, name: 'team', field_type: 'assignment', assignment_type: at_t)}
  let!(:ff_time) { FactoryGirl.create(:form_field, name: 'submittedAt', field_type: 'time')}

  let!(:data) do
    {
      request_id: rand.to_s,
      form_fields: [
        {:value => team_1.id, field_type: 'assignment', form_field_id: ff_t.id},
        {input_type: 'option', field_type: 'assignment', value: route_1.id, form_field_id: ff_r.id},
        {value: DateTime.now.strftime('%Q').to_i, form_field_id: ff_time.id}
      ]
    }
  end

  before :each do
    sf_id = SubmitForm::PersistForm::Main.run(data)
    subject(sf_id)
  end

  context 'when submitted for the first time' do
    it 'checks in for the route' do
      route_check_in = Assignment.find_by(name: 'routeCheckIn', assignment_type: at_ft)

      fvo_route_check_in = FormValueOption.find_by(assignment_id: route_check_in.id)
      fvo_route_1 = FormValueOption.find_by(assignment_id: route_1.id)

      fv = FormValue.where(form_value_option_id: fvo_route_check_in.id)
      fv_r = FormValue.find_by(submitted_form_id: fv.first.submitted_form_id, form_field_id: ff_r.id)

      expect(fv.count).to eq(1)
      expect(fv_r.form_value_option_id).to eq(fvo_route_1.id)
    end
  end

  context 'when same route survey is submitted' do
    let!(:data_2) do
      {
        request_id: rand.to_s,
        form_fields: [
          {:value => team_1.id, field_type: 'assignment', form_field_id: ff_t.id},
          {input_type: 'option', field_type: 'assignment', value: route_1.id, form_field_id: ff_r.id},
          {value: DateTime.now.strftime('%Q').to_i, form_field_id: ff_time.id}
        ]
      }
    end

    before :each do
      @sf_id = SubmitForm::PersistForm::Main.run(data_2)
    end

    it 'does nothing' do
      expect{subject(@sf_id)}.to change{SubmittedForm.all.count}.by(0)
    end
  end

  context 'when different route survey is submitted' do
    let!(:data_3) do
      {
        request_id: rand.to_s,
        form_fields: [
          {:value => team_1.id, field_type: 'assignment', form_field_id: ff_t.id},
          {input_type: 'option', field_type: 'assignment', value: route_2.id, form_field_id: ff_r.id},
          {value: DateTime.now.strftime('%Q').to_i, form_field_id: ff_time.id}
        ]
      }
    end

    before :each do
      sf_id = SubmitForm::PersistForm::Main.run(data_3)
      subject(sf_id)
    end

    it 'checks out for the old route' do
      route_check_out = Assignment.find_by(name: 'routeCheckOut', assignment_type: at_ft)

      fvo_route_check_out = FormValueOption.find_by(assignment_id: route_check_out.id)
      fvo_route_1 = FormValueOption.find_by(assignment_id: route_1.id)

      fv = FormValue.where(form_value_option_id: fvo_route_check_out.id)
      fv_r = FormValue.find_by(submitted_form_id: fv.first.submitted_form_id, form_field_id: ff_r.id)

      expect(fv.count).to eq(1)
      expect(fv_r.form_value_option_id).to eq(fvo_route_1.id)
    end

    it 'checks in for the new route' do
      route_check_in = Assignment.find_by(name: 'routeCheckIn', assignment_type: at_ft)

      fvo_route_check_in = FormValueOption.find_by(assignment_id: route_check_in.id)
      fvo_route_2 = FormValueOption.find_by(assignment_id: route_2.id)

      fv = FormValue.where(form_value_option_id: fvo_route_check_in.id).map(&:submitted_form_id)
      fv_r = FormValue.where(submitted_form_id: fv, form_field_id: ff_r.id)

      expect(fv.count).to eq(2)
      expect(fv_r.map(&:form_value_option_id)).to include(fvo_route_2.id)
    end
  end

end
