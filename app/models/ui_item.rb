class UiItem < ApplicationRecord
  belongs_to :form_field
  belongs_to :ui_item_type
  has_many :ui_item_property_relations
  has_many :ui_item_properties, through: :ui_item_property_relations
end
