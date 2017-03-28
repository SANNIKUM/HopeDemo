require 'rails_helper'

describe Seed::Assignments do

  before(:all) do
    data = [
      {
        borough: "MN",
        hope_area: 394,
        hard_to_reach: nil,
        park: nil,
        station: nil,
        route: nil,
        end_of_line: nil,
        precinct: 19,
        needs_nypd: nil,
        training_site: "Hunter College"
      },
      {
        borough: "T",
        hope_area: 7,
        hard_to_reach: nil,
        park: nil,
        station: "Lexington Av / 59 St",
        route: "N-Q-R",
        end_of_line: nil,
        precinct: 19,
        needs_nypd: nil,
        training_site: "Hunter College"
      }
    ]
    Seed::Assignments.helper(data)
  end

  describe 'assignment_types' do
    it 'creates route, site, zone assignment types' do
      r = AssignmentType.where(name: 'route')
      s = AssignmentType.where(name: 'site')
      z = AssignmentType.where(name: 'zone')

      expect(r.count).to eq(1)
      expect(s.count).to eq(1)
      expect(z.count).to eq(1)
    end
  end

  describe 'assignment_relation_types' do
    it 'creates only 2 relation types' do
      expect(AssignmentRelationType.all.count).to eq(2)
    end
  end

  describe 'assignments' do
    it 'creates route assignemnts' do
      r1 = Assignment.where(name: 'M394', label: '394')
      expect(r1.count).to eq(1)

      r2 = Assignment.where(name: 'T7', label: 'T7')
      expect(r2.count).to eq(1)
    end

    it 'creates site assignments' do
      s = AssignmentType.find_by(name: 'site')
      sites = Assignment.where(assignment_type_id: s.id)

      expect(sites.count).to eq(1)
      expect(sites.first.name).to eq('Hunter College')
    end

    it 'creates zone assignments' do
      z = AssignmentType.find_by(name: 'zone')
      zones = Assignment.where(assignment_type_id: z.id)

      expect(zones.count).to eq(1)
      expect(zones.first.name).to eq('Manhattan')
    end
  end

  describe 'assignment_relations' do
    it 'creates all relations wihtout duplicates' do
      expect(AssignmentRelation.all.count).to eq(3)
    end
  end

  describe 'assignment_property_types' do
    it 'creates all propety types' do
      expect(AssignmentPropertyType.all.count).to eq(6)
      expect(AssignmentPropertyType.where(name: 'park')).to be_present
      expect(AssignmentPropertyType.where(name: 'station')).to be_present
      expect(AssignmentPropertyType.where(name: 'route')).to be_present
      expect(AssignmentPropertyType.where(name: 'endOfLine')).to be_present
      expect(AssignmentPropertyType.where(name: 'nypd')).to be_present
      expect(AssignmentPropertyType.where(name: 'type')).to be_present
    end
  end

  describe 'assignment_properties' do
    it 'should not create property when value is nil' do
      r = Assignment.find_by(name: 'T7', label: 'T7')
      props = AssignmentProperty.where(assignment_id: r.id)

      expect(props.count).to eq(3)
    end

    it 'creates all correct properties' do
      r = Assignment.find_by(name: 'T7', label: 'T7')
      values = AssignmentProperty.where(assignment_id: r.id).map(&:value)

      expect(values).to contain_exactly('Subway', 'Lexington Av / 59 St', 'N-Q-R')
    end
  end
end
