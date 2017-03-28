module Serializers::UiItem::FormField

  def self.run(hash)
    form_field_id = ::UiItem.find(hash[:id]).form_field_id
    if form_field_id
      include_options = (hash[:inputType] != 'string')
      x = hash[:includeAllIfNoneAssigned]
      puts "\n hash : #{hash.to_json}"
      include_all_if_none_assigned = x.present? ? (x == "true") : true
      puts "\n include_all_if_none_assigned: #{include_all_if_none_assigned}"
      result = {
        form_field: self.form_field_serializer(
          form_field_id,
          hash[:assignment_ids],
          include_options,
          include_all_if_none_assigned
        ),
        is_form_field: true
      }
    else
      result = {}
    end
    result
  end

  private

  def self.form_field_serializer(*args)
    Serializers::FormField::Main.run(*args)
  end
end
