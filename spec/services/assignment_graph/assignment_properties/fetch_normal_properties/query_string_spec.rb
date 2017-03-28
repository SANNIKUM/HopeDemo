require 'rails_helper'


describe AssignmentGraph::AssignmentProperties::FetchNormalProperties::QueryString do

  def fc(*args) FactoryGirl.create(*args) end

  def subject(*args)
    s = AssignmentGraph::AssignmentProperties::FetchNormalProperties::QueryString.run(*args)
    squish(s)
  end

  def squish(s)
    s.gsub(/(\s|\u00A0)+/, ' ')
  end

  it 'works' do
    asg_ids = [1]
    properties = ['prop1']
    pre_expected = <<-SQL
      SELECT
        asgs.id as id,
        asgs.assignment_type_id as assignment_type_id,
        ats.name as assignment_type_name,
        aps_0.value as prop1
      FROM assignments asgs
      JOIN assignment_types ats
        ON asgs.assignment_type_id = ats.id
      LEFT JOIN assignment_property_types apts_0
       ON apts_0.name = 'prop1'
      LEFT JOIN assignment_properties aps_0
       ON     apts_0.id = aps_0.assignment_property_type_id
          AND asgs.id = aps_0.assignment_id
      WHERE asgs.id IN (1)
    SQL
    expected = squish(pre_expected)
    result = subject(properties, asg_ids)
    expect(result).to eq(expected)
  end

end
