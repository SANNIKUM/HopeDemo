class AssignmentProperty < ApplicationRecord
  belongs_to :assignment_property_type
  belongs_to :assignment
end
