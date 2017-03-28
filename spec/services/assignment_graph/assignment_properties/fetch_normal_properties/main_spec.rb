require 'rails_helper'

describe AssignmentGraph::AssignmentProperties::FetchNormalProperties::Main do

  def subject(*args)
    AssignmentGraph::AssignmentProperties::FetchNormalProperties::Main.run(*args)
  end

  def fc(*args)
    FactoryGirl.create(*args)
  end

  let!(:at1) { fc(:assignment_type, name: 'at1') }
  let!(:at2) { fc(:assignment_type, name: 'at2') }
  let!(:asg1) { fc(:assignment, name: 'asg1', assignment_type: at1) }
  let!(:asg2) { fc(:assignment, name: 'asg2', assignment_type: at2) }

  let!(:apt1) { fc(:assignment_property_type, name: 'apt1') }
  let!(:apt2) { fc(:assignment_property_type, name: 'apt2') }

  let!(:ap11) { fc(:assignment_property, assignment: asg1, assignment_property_type: apt1, value: 'value11') }
  let!(:ap12) { fc(:assignment_property, assignment: asg1, assignment_property_type: apt2, value: 'value12') }
  let!(:ap21) { fc(:assignment_property, assignment: asg2, assignment_property_type: apt1, value: 'value21') }
  let!(:ap22) { fc(:assignment_property, assignment: asg2, assignment_property_type: apt2, value: 'value22') }

  let!(:asg_hashes) do
    [
      {id: asg1.id, assignment_type_id: at1.id},
      {id: asg2.id, assignment_type_id: at2.id}
    ]
  end

  let!(:properties_arr) do
    [
      {name: 'at1', properties: ['apt1']},
      {name: 'at2', properties: ['apt2']}
    ]
  end

  it 'works' do
    expected = [
      {id: asg1.id, assignment_type_id: at1.id, apt1: 'value11'},
      {id: asg2.id, assignment_type_id: at2.id, apt2: 'value22'}
    ]
    actual = subject(asg_hashes, properties_arr)
    expect(expected).to match_array(actual)
  end
end
