module AssignmentGraph::Main

  def self.run(hash)
    asg_ids_1 = self.assignment_ids(hash[:context_assignment_ids])
    at_ids = self.assignment_type_ids(hash)
    asgs = Assignment.where(id: asg_ids_1).where(assignment_type_id: at_ids).includes(:assignment_type)
    asg_ids_2 = asgs.ids
    relations = AssignmentRelation.where(assignment_1_id: asg_ids_2, assignment_2_id: asg_ids_2)
    asg_hashes = asgs.map do |asg|
      atts = asg.attributes
      atts.merge({assignment_type: asg.assignment_type.attributes}).deep_symbolize_keys
    end
    asg_hashes2 = self.assignment_properties(asg_hashes, hash).map(&:deep_symbolize_keys)
    {
      assignments: asg_hashes2,
      assignment_relations: relations
    }
  end

  private

  def self.assignment_ids(*args)
    ContextInference::Main.run(*args)
  end

  def self.assignment_type_ids(hash)
    names = hash[:types].map{|t| t[:name]}
    AssignmentType.where(name: names).ids
  end

  def self.assignment_properties(*args)
    AssignmentGraph::AssignmentProperties::Main.run(*args)
  end
end
