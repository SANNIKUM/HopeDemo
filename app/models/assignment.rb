class Assignment < ApplicationRecord
  belongs_to :assignment_type
  has_many :assignment_relations_as_1, inverse_of: :assignment_1, class_name: "AssignmentRelation"
  has_many :assignment_relations_as_2, inverse_of: :assignment_2, class_name: "AssignmentRelation"
  has_many :assignment_properties
  has_many :form_value_options
end
