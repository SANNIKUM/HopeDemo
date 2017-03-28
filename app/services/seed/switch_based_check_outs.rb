module Seed::SwitchBasedCheckOuts

  def self.run
    SwitchBasedCheckOut.delete_all

    self.data.each do |x|
      name_t = x[:target_assignment_name]
      name_h = x[:helper_assignment_name]

      target = AssignmentType.find_or_create_by(name: name_t)
      helper = AssignmentType.find_or_create_by(name: name_h)

      SwitchBasedCheckOut.find_or_create_by(
        name: "#{name_t.capitalize} by #{name_h.capitalize}",
        target_assignment_type_id: target.id,
        helper_assignment_type_id: helper.id
      )
    end
  end

  private

  def self.data
    [
      {
        target_assignment_name: 'route',
        helper_assignment_name: 'team'
      }
    ]
  end

end
