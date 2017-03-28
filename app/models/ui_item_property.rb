class UiItemProperty < ApplicationRecord
  belongs_to :ui_item_property_type
  has_many :ui_item_property_relations
  has_many :ui_items, through: :ui_item_property_relations
end
