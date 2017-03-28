module Serializers::FormValueOption::Main

  def self.run(id)
    fvo = FormValueOption.find(id)
    assignment = fvo.assignment_id.present? ? self.assignment.run(fvo.assignment_id) : nil
    fvo.attributes.merge({
      assignment: assignment
    })
  end

  def self.assignment
    Serializers::Assignment::Main
  end
end
