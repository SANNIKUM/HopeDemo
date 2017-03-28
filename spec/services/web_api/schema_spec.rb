require 'rails_helper'

describe WebApi::Schema do

  def subject(*args)
    WebApi::Schema.execute(*args).deep_symbolize_keys[:data]
  end

  def fc(*args) FactoryGirl.create(*args) end

  it 'works at all' do
    query = "{ test }"
    result = subject(query)
    expect(result).to eq({
      test: "hello world"
    })
  end

  it 'provides assignments api' do
    at1 = fc(:assignment_type, name: 'at1')
    asg1 = fc(:assignment, name: 'asg1', assignment_type_id: at1.id)

    query = "{
      assignmentGraph(
        contextAssignmentIds: [#{asg1.id}],
        types: [
          {name: \"at1\", properties: []}
        ]
      ) {
        assignments {
          id
          assignmentType {
            id
            name
          }
        }
        assignmentRelations {
          id
        }
      }
    }"
    result = subject(query)
    expect(result). to eq({
      assignmentGraph: {
        assignments: [
          {id: asg1.id, assignmentType: {id: at1.id, name: 'at1'}}
        ],
        assignmentRelations: []
      }
    })
  end

  it 'crawls assignment graph' do
    at1 = fc(:assignment_type, name: 'at1')
    at2 = fc(:assignment_type, name: 'at2')
    asg1 = fc(:assignment, name: 'asg1', assignment_type: at1)
    asg2 = fc(:assignment, name: 'asg2', assignment_type: at2)
    ar = fc(:assignment_relation, assignment_1_id: asg1.id, assignment_2_id: asg2.id)
    query = "{
      assignmentGraph(
        contextAssignmentIds: [#{asg1.id}],
        types: [
          {name: \"at1\", properties: []},
          {name: \"at2\", properties: []}
        ]
      ) {
        assignments {
          id
        }
        assignmentRelations {
          id
        }
      }
    }"
    result = subject(query)
    expect(result). to eq({
      assignmentGraph: {
        assignments: [
          {id: asg1.id},
          {id: asg2.id}
        ],
        assignmentRelations: [{id: ar.id}]
      }
    })
  end

  it 'fetches properties' do
    at1 = fc(:assignment_type, name: 'at1')
    at2 = fc(:assignment_type, name: 'at2')
    asg1 = fc(:assignment, name: 'asg1', assignment_type: at1)
    asg2 = fc(:assignment, name: 'asg2', assignment_type: at2)
    apt1 = fc(:assignment_property_type, name: 'apt1')
    apt2 = fc(:assignment_property_type, name: 'apt2')
    ap1 = fc(:assignment_property, assignment_property_type: apt1, assignment: asg1, value: 'value11')

    ar = fc(:assignment_relation, assignment_1_id: asg1.id, assignment_2_id: asg2.id)
    query = "{
      assignmentGraph(
        contextAssignmentIds: [#{asg1.id}],
        types: [
          {name: \"at1\", properties: [\"apt1\"]},
          {name: \"at2\", properties: []}
        ]
      ) {
        assignments {
          id
          properties
        }
        assignmentRelations {
          id
        }
      }
    }"
    result = subject(query)
    expect(result). to eq({
      assignmentGraph: {
        assignments: [
          {id: asg1.id, properties: {apt1: 'value11'}},
          {id: asg2.id, properties: {}}
        ],
        assignmentRelations: [{id: ar.id}]
      }
    })
  end
end
