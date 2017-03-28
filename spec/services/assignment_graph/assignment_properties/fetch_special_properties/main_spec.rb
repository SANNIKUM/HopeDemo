require 'rails_helper'

describe AssignmentGraph::AssignmentProperties::FetchSpecialProperties::Main do

  let!(:at_t) { FactoryGirl.create(:assignment_type, name: 'team') }
  let!(:at_r) { FactoryGirl.create(:assignment_type, name: 'route') }
  let!(:at_ft) { FactoryGirl.create(:assignment_type, name: 'formType') }
  let!(:at_ftc) { FactoryGirl.create(:assignment_type, name: 'formTypeCategory') }

  let!(:switch) { FactoryGirl.create(:switch_based_check_out, name: 'Route by Team', target_assignment_type_id: at_r.id, helper_assignment_type_id: at_t.id)}

  let!(:team_1) { FactoryGirl.create(:assignment, name: 'team_1', assignment_type: at_t)}
  let!(:route_1) { FactoryGirl.create(:assignment, name: 'route_1', assignment_type: at_r)}
  let!(:route_2) { FactoryGirl.create(:assignment, name: 'route_2', assignment_type: at_r)}
  let!(:route_3) { FactoryGirl.create(:assignment, name: 'route_3', assignment_type: at_r)}

  let!(:t_to_r) { FactoryGirl.create(:assignment_relation_type, assignment_1_type: at_t, assignment_2_type: at_r)}
  let!(:t1_r1) { FactoryGirl.create(:assignment_relation, assignment_1: team_1, assignment_2: route_1, assignment_relation_type: t_to_r) }
  let!(:t1_r2) { FactoryGirl.create(:assignment_relation, assignment_1: team_1, assignment_2: route_2, assignment_relation_type: t_to_r) }
  let!(:t1_r3) { FactoryGirl.create(:assignment_relation, assignment_1: team_1, assignment_2: route_3, assignment_relation_type: t_to_r) }

  let!(:ff_ft) { FactoryGirl.create(:form_field, name: 'formType', field_type: 'assignment', assignment_type: at_ft) }
  let!(:ff_ftc) { FactoryGirl.create(:form_field, name: 'formTypeCategory', field_type: 'assignment', assignment_type: at_ftc) }
  let!(:ff_r) { FactoryGirl.create(:form_field, name: 'route', field_type: 'assignment', assignment_type: at_r) }
  let!(:ff_t) { FactoryGirl.create(:form_field, name: 'team', field_type: 'assignment', assignment_type: at_t) }
  let!(:ff_lat) { FactoryGirl.create(:form_field, name: 'latitude', field_type: 'string') }
  let!(:ff_lng) { FactoryGirl.create(:form_field, name: 'longitude', field_type: 'string') }
  let!(:ff_time) { FactoryGirl.create(:form_field, name: 'submittedAt', field_type: 'time')}


  let!(:assignments) {[
    {id: route_1.id},
    {id: route_2.id, properties: {}},
    {id: route_3.id, properties: {awesome_property: "awesome_value"}},
    {id: team_1.id}
  ]}
  let!(:properties) { [{name: "route", properties: ["status"]}, {name: "team", properties: ["location"]}] }

  let!(:data) do
    {
      request_id: rand.to_s,
      form_fields: [
        {field_type: 'string', value: '0.123456789', form_field_id: ff_lat.id},
        {field_type: 'string', value: '-0.123456789', form_field_id: ff_lng.id},
        {field_type: 'assignment', value: team_1.id, form_field_id: ff_t.id},
        {input_type: 'option', field_type: 'assignment', value: route_1.id, form_field_id: ff_r.id},
        {field_type: 'time', value: 1000000000000, form_field_id: ff_time.id}
      ]
    }
  end

  let!(:data_2) do
    {
      request_id: rand.to_s,
      form_fields: [
        {field_type: 'string', value: '1.234567890', form_field_id: ff_lat.id},
        {field_type: 'string', value: '-1.234567890', form_field_id: ff_lng.id},
        {field_type: 'assignment', value: team_1.id, form_field_id: ff_t.id},
        {input_type: 'option', field_type: 'assignment', value: route_2.id, form_field_id: ff_r.id},
        {field_type: 'time', value: 2000000000000, form_field_id: ff_time.id}
      ]
    }
  end


  def subject(*args)
    AssignmentGraph::AssignmentProperties::FetchSpecialProperties::Main.run(*args)
  end

  before :each do
    sf_id_1 = SubmitForm::PersistForm::Main.run(data)
    SubmitForm::SwitchBasedCheckOut::Main.run(sf_id_1)
    sf_id_2 = SubmitForm::PersistForm::Main.run(data_2)
    SubmitForm::SwitchBasedCheckOut::Main.run(sf_id_2)
    @result = subject(assignments, properties)
  end

  it 'fetches status and location' do
    expect(@result).to contain_exactly(
      {id: route_1.id, properties: {status: "completed"}},
      {id: route_2.id, properties: {status: "in_progress"}},
      {id: route_3.id, properties: {awesome_property: "awesome_value", status: "not_started"}},
      {id: team_1.id, properties: {latitude: "1.234567890", longitude: "-1.234567890"}}
    )
  end
end
