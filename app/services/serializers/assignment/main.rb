module Serializers::Assignment::Main

  def self.run(id)
    x = Assignment.find(id).attributes
    y = x.merge(self.properties(id))
    z = y.merge({assignment_type: AssignmentType.find_by(id: y[:assignment_type_id])})
    z
  end

  private

  def self.properties(id)
    arr = AssignmentProperty.where(assignment_id: id)
    self.properties_compressor.run({arr: arr, type_name: 'assignment_property_type'})
  end

  def self.properties_compressor
    PropertiesCompressor
  end
end
