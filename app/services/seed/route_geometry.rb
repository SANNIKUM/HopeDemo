module Seed::RouteGeometry

  def self.run
    self.cool('route_geometry')
  end

  def self.sf
    self.cool('sf_route_geometry')
  end

  def self.clear_and_run
    apt1 = AssignmentPropertyType.where(name: 'multipolygon_coordinates')
    apt2 = AssignmentPropertyType.where(name: 'point_coordinates')
    apt_ids = apt1.to_a.concat(apt2.to_a).map(&:id)
    ap = AssignmentProperty.where(assignment_property_type: apt_ids)
    ap.delete_all
    self.run
  end

  private

  def self.cool(filename)
    data = ActiveSupport::JSON.decode(File.read("app/services/seed/data/#{filename}.json"))
    data['features'].each do |f|
      self.helper(f)
    end
  end

  def self.helper(f)
    n = f['properties']['Name']
    g = f['geometry']
    t = g['type']
    c = g['coordinates'].to_s

    type = (t == 'MultiPolygon') ? 'multipolygon' : 'point'

    at = AssignmentType.find_by(name: "route")
    asg = Assignment.find_by(assignment_type: at, name: n)

    if asg.present?
      apt = AssignmentPropertyType.find_or_create_by(name: "#{type}_coordinates", is_singleton: true)
      ap = AssignmentProperty.find_or_create_by(assignment: asg, assignment_property_type: apt, value: c)
    end
  end
end











#
