class AssignmentRelation < ApplicationRecord
  belongs_to :assignment_1, class_name: "Assignment", inverse_of: :assignment_relations_as_1
  belongs_to :assignment_2, class_name: "Assignment", inverse_of: :assignment_relations_as_2
  belongs_to :assignment_relation_type
end
