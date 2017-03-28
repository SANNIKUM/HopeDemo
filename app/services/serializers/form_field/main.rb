module Serializers::FormField::Main

  def self.run(id, assignment_ids, include_options=true, include_all_if_none_assigned=true)
    form_field = FormField.find(id)
    if include_options
      fvo_ids = self.form_value_option_ids(form_field, assignment_ids, include_all_if_none_assigned)
      fvos = Map.run(self.serialize_form_value_options, fvo_ids)
      form_field.attributes.merge(form_value_options: fvos)
    else
      form_field.attributes
    end
  end

  private

  def self.form_value_option_ids(form_field, assignment_ids, include_all_if_none_assigned)
    puts "\n in ff : include_all_if_none_assigned: #{include_all_if_none_assigned}"
    if form_field.field_type == 'option'
      fvo_ids = FormFieldValueOption.where(form_field_id: form_field.id).map(&:form_value_option_id)
    elsif form_field.field_type == 'assignment'
      x = Assignment.where(assignment_type_id: form_field.assignment_type_id).where(id: assignment_ids)
      if x.any?
        puts "IF 1"
        y = x
      elsif include_all_if_none_assigned
        puts "IF 2"
        y = Assignment.where(assignment_type_id: form_field.assignment_type_id)
      else "IF 3"
        y = x
      end
      asg_ids_2 = y.map(&:id)
      fvo_ids = asg_ids_2.map do |asg_id|
        FormValueOption.find_or_create_by(assignment_id: asg_id).id
      end
    else
      fvo_ids = []
    end
    fvo_ids
  end

  def self.serialize_form_value_options
    Serializers::FormValueOption::Main
  end
end
