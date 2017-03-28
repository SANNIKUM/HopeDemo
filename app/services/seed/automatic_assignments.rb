module Seed::AutomaticAssignments

  def self.run
    AutomaticAssignment.delete_all
    Map.run(self.proc, self.data)
  end

  private

  def self.proc
    lambda do |hash|
      origin_type = self.at(hash[:origin_type_name])
      connector_type = self.at(hash[:connector_type_name])
      target_type = self.at(hash[:target_type_name])
      art = self.art(hash[:assignment_relation_type])
      AutomaticAssignment.find_or_create_by(
        origin_type_id: origin_type.id,
        connector_type_id: connector_type.id,
        target_type_id: target_type.id,
        assignment_relation_type_id: art.id,
      ).update(connection_limit: hash[:connection_limit])
    end
  end

  def self.art(hash)
    a1t = self.at(hash[:assignment_1])
    a2t = self.at(hash[:assignment_2])
    art = AssignmentRelationType.find_or_create_by(
      assignment_1_type_id: a1t.id,
      assignment_2_type_id: a2t.id
    )
    name = "#{a1t.name.capitalize} to #{a2t.name.capitalize}"
    art.update(name: name)
    art
  end

  def self.at(name)
    AssignmentType.find_or_create_by(name: name)
  end

  def self.data
    [
      {
        origin_type_name: 'user',
        connector_type_name: 'site',
        target_type_name: 'site',
        assignment_relation_type: {assignment_1: 'user', assignment_2: 'site'},
        connection_limit: nil,
      },
      {
        origin_type_name: 'user',
        connector_type_name: 'site',
        target_type_name: 'team',
        assignment_relation_type: {assignment_1: 'user', assignment_2: 'team'},
        connection_limit: 5,
      },
      {
        origin_type_name: 'user',
        connector_type_name: 'countInstance',
        target_type_name: 'countInstance',
        assignment_relation_type: {assignment_1: 'user', assignment_2: 'countInstance'},
      }
    ]
  end

end
