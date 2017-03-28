class SwitchBasedCheckOut < ApplicationRecord
  belongs_to(
    :target_assignment_type,
    class_name: "AssignmentType",
    foreign_key: :target_assignment_type_id
  )

  belongs_to(
    :helper_assignment_type,
    class_name: "AssignmentType",
    foreign_key: :helper_assignment_type_id
  )
end
