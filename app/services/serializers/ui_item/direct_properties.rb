module Serializers::UiItem::DirectProperties

  def self.run(hash)
    x = UiItemPropertyRelation.where(ui_item_id: hash[:id])
    y = UiItemProperty.where(id: x.map(&:ui_item_property_id))
                      .includes(:ui_item_property_type)
    self.properties_compressor({arr: y, type_name: 'ui_item_property_type', ui_item_id: hash[:id]})
  end

  private

  def self.properties_compressor(args)
    PropertiesCompressor.run(args)
  end
end
