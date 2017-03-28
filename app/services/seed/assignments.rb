module Seed::Assignments

  def self.run
    data = CSV.table('app/services/seed/data/assignments.csv')
    self.helper(data)
  end

  def self.helper(data)
    data.each do |row|
      self.seed_assignments(row.to_hash)
    end
  end

  def self.seed_assignments(row)
    route_type = AssignmentType.find_or_create_by(name: 'route')
    site_type  = AssignmentType.find_or_create_by(name: 'site')
    zone_type  = AssignmentType.find_or_create_by(name: 'zone')

    route_to_site_type = AssignmentRelationType.find_or_create_by(assignment_1_type: route_type, assignment_2_type: site_type, name: 'Route to Site')
    site_to_zone_type = AssignmentRelationType.find_or_create_by(assignment_1_type: site_type, assignment_2_type: zone_type, name: 'Site to Zone')

    route_name = "#{self.get_borough_prefix(row[:borough])}#{row[:hope_area]}"
    label = row[:borough] == "T" ? "T#{row[:hope_area]}" : row[:hope_area].to_s

    site_name = row[:training_site]
    zone_name = self.get_zone_name(site_name)
    route = Assignment.find_or_create_by(name: route_name, assignment_type: route_type, label: label)
    site = Assignment.find_or_create_by(name: site_name, assignment_type: site_type)
    zone = Assignment.find_or_create_by(name: zone_name, assignment_type: zone_type)

    route_to_site = AssignmentRelation.find_or_create_by(assignment_1: route, assignment_2: site, assignment_relation_type: route_to_site_type)
    site_to_zone = AssignmentRelation.find_or_create_by(assignment_1: site, assignment_2: zone, assignment_relation_type: site_to_zone_type)

    park_property = AssignmentPropertyType.find_or_create_by(name: 'park', label: 'Park', is_singleton: true)
    station_property = AssignmentPropertyType.find_or_create_by(name: 'station', label: 'Station', is_singleton: true)
    train_route_property = AssignmentPropertyType.find_or_create_by(name: 'route', label: 'Route', is_singleton: true)
    end_of_line_property = AssignmentPropertyType.find_or_create_by(name: 'endOfLine', label: 'End of Line', is_singleton: true)
    nypd_property = AssignmentPropertyType.find_or_create_by(name: 'nypd', label: 'Need NYPD?', is_singleton: true)
    type_property = AssignmentPropertyType.find_or_create_by(name: 'type', label: 'Type', is_singleton: true)

    AssignmentProperty.find_or_create_by(value: row[:park], assignment: route, assignment_property_type: park_property) unless row[:park].nil?
    AssignmentProperty.find_or_create_by(value: row[:station], assignment: route, assignment_property_type: station_property) unless row[:station].nil?
    AssignmentProperty.find_or_create_by(value: row[:route], assignment: route, assignment_property_type: train_route_property) unless row[:route].nil?
    AssignmentProperty.find_or_create_by(value: row[:end_of_line], assignment: route, assignment_property_type: end_of_line_property) unless row[:end_of_line].nil?
    AssignmentProperty.find_or_create_by(value: row[:needs_nypd], assignment: route, assignment_property_type: nypd_property) unless row[:needs_nypd].nil?

    if row[:park]
      AssignmentProperty.find_or_create_by(value: 'Park', assignment: route, assignment_property_type: type_property)
    elsif row[:station]
      AssignmentProperty.find_or_create_by(value: 'Subway', assignment: route, assignment_property_type: type_property)
    else
      AssignmentProperty.find_or_create_by(value: 'Street', assignment: route, assignment_property_type: type_property)
    end
  end

  def self.get_borough_prefix(borough)
    {
      MN: "M",
      BK: "K",
      BX: "X",
      SI: "S",
      T: "T",
      QN: "Q"
    }[borough.to_sym]
  end

  def self.get_zone_name(site_name)
    site_to_zone = {
      "Hunter College" => "Manhattan",
      "Hostos" => "Bronx",
      "Brooklyn College" => "Brooklyn",
      "LaGuardia" => "Queens",
      "Temple Emanuel" => "Staten Island",
    }
    site_to_zone[site_name]
  end
end
