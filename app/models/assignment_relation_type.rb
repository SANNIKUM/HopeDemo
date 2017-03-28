class AssignmentRelationType < ApplicationRecord
  has_many :assignment_relations
  belongs_to :assignment_1_type, inverse_of: :assignment_relations_as_1, class_name: "AssignmentType"
  belongs_to :assignment_2_type, inverse_of: :assignment_relations_as_2, class_name: "AssignmentType"
end
