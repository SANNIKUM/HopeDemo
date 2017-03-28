module Seed::AutomaticAssignmentFormValues

  def self.run
    Map.run(self.helper, self.data)
  end

  private

  def self.helper
    lambda do |hash|
      trigger_type_id = AssignmentType.find_by(name: hash[:trigger]).id
      target_type_id = AssignmentType.find_by(name: hash[:target]).id
      AutomaticAssignmentFormValue.find_or_create_by(
        trigger_type_id: trigger_type_id,
        target_type_id: target_type_id
      )
    end
  end

  def self.data
    [
      {trigger: "route", target: "team"}
    ]
  end

end
