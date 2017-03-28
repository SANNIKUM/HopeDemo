module Seed::Teams

  def self.run
    data = CSV.table('app/services/seed/data/teams.csv')
    self.helper(data)
  end

  private


  def self.helper(data)
    data.each do |row|
      self.handle_row(row.to_hash)
    end
  end


  def self.handle_row(row)
    # BOROUGH,HOPE Area,Team Number,Needs NYPD?,Hard to Reach,Park,Station,Route,End of Line,Precinct,Training Site,

    borough = row[:borough]
    hope_area = row[:hope_area]
    team_pre_label = row[:team_number]
    needs_nypd = row[:needs_nypd]

    route_name = "#{borough}#{hope_area}"
    route = Assignment.find_by(name: route_name)

    if route.present?
      self.nypd_property(route, needs_nypd)
      team_type  = AssignmentType.find_or_create_by(name: 'team')
      site_type  = AssignmentType.find_or_create_by(name: 'site')
      route_type = AssignmentType.find_or_create_by(name: 'route')

      site_to_team_type = AssignmentRelationType.find_or_create_by(name: 'Site to Team', assignment_1_type_id: site_type.id, assignment_2_type_id: team_type.id)
      team_to_route_type = AssignmentRelationType.find_or_create_by(name: 'Team to Route', assignment_1_type_id: team_type.id, assignment_2_type_id: route_type.id)
      route_to_site_type = AssignmentRelationType.find_by(name: 'Route to Site')

      site = Assignment.find(AssignmentRelation.find_by(assignment_1_id: route.id, assignment_relation_type: route_to_site_type).assignment_2_id)

      team_name = "#{site.name}:#{team_pre_label}"
      team_label = "Team_#{team_pre_label}"

      team = Assignment.find_or_create_by(assignment_type: team_type, name: team_name)
      team.update(label: team_label)
      team_to_site = AssignmentRelation.find_or_create_by(assignment_relation_type: site_to_team_type, assignment_1_id: site.id, assignment_2_id: team.id)
      team_to_route = AssignmentRelation.find_or_create_by(assignment_relation_type: team_to_route_type, assignment_1_id: team.id, assignment_2_id: route.id)
    end
  end

  def self.nypd_property(route, needs_nypd)
    apt = AssignmentPropertyType.find_or_create_by(name: 'needs_nypd')
    value = (needs_nypd == "YES") ? "true" : "false"
    ap = AssignmentProperty.find_or_create_by(assignment: route, assignment_property_type: apt, value: value)
  end
end
