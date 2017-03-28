class AssignmentType < ApplicationRecord
  has_many :assignments
  has_many :assignment_relations_as_1, inverse_of: :assignment_1_type, class_name: "AssignmentRelation"
  has_many :assignment_relations_as_2, inverse_of: :assignment_2_type, class_name: "AssignmentRelation"
end
