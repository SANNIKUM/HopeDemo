require 'rails_helper'

describe AssignmentGraph::AssignmentProperties::FetchNormalProperties::Zip do

  def subject(*args)
    AssignmentGraph::AssignmentProperties::FetchNormalProperties::Zip.run(*args)
  end

  def fc(*args)
    FactoryGirl.create(*args)
  end

  let!(:at1) { fc(:assignment_type, name: 'at1') }
  let!(:at2) { fc(:assignment_type, name: 'at2') }

  it 'works' do
    asg_hashes = [
      {id: 1, assignment_type_id: at1.id},
      {id: 2, assignment_type_id: at2.id}
    ]
    properties_arr = [
      {name: 'at1', properties: ['prop1']},
      {name: 'at2', properties: ['prop2']}
    ]
    input_result = [
      {id: 1, prop1: 'value11', prop2: 'value12'},
      {id: 2, prop1: 'value21', prop2: 'value22'}
    ]

    expected = [
      {id: 1, assignment_type_id: 1, prop1: 'value11'},
      {id: 2, assignment_type_id: 2, prop2: 'value22'}
    ]

    actual = subject(asg_hashes, properties_arr, input_result)
    expect(actual).to match_array(expected)
  end
end
