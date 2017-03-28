module DataForCsv::Main

  def self.run(assignment_name)
    asg = Assignment.find_by(name: assignment_name)
    fvos = FormValueOption.where(assignment_id: asg.id)
    pre_fvs = FormValue.where(form_value_option: fvos)
    sf_ids1 = pre_fvs.map(&:submitted_form_id).uniq
    sfs = SubmittedForm.where(id: sf_ids1).to_a.uniq{|sf| sf.request_id}

    fvs = FormValue.where(submitted_form_id: sfs.map(&:id))
    ffs = FormField.where(id: fvs.map(&:form_field_id)).order(:name)

    ffgs = self.form_field_groups(ffs)

    headers = self.headers(ffgs)
    data = Map.run(self.row(ffgs), sfs)
    final = [headers].concat(data)
    final
  end

  private

  def self.headers(ffgs)
    main = ffgs.reduce([]) do |acc, ele|
      form_field_name = ele[:form_field_name]
      apt_labels = ele[:assignment_property_types].map do |apt|
        "#{ele[:assignment_type].name}: #{apt.name}"
      end
      acc.concat([form_field_name]).concat(apt_labels)
    end
    ['requestId'].concat(main)
  end

  def self.form_field_groups(ffs)
    ffs.group_by{|ff| ff.name}.map do |k, v|
      {
        form_field_name: k,
        field_type: v.first.field_type,
        ids: v.map(&:id),
        assignment_type: AssignmentType.find_by(id: v.first.assignment_type_id),
        assignment_property_types: self.assignment_property_types(v.first)
      }
    end
  end

  def self.assignment_property_types(form_field)
    return [] if form_field.assignment_type_id.nil?
    asgs = Assignment.where(assignment_type_id: form_field.assignment_type_id)
    aps = AssignmentProperty.where(assignment_id: asgs.map(&:id))
    AssignmentPropertyType.where(id: aps.map(&:assignment_property_type_id))
  end

  def self.row(ffgs)
    lambda do |sf|
      [sf.request_id].concat(Reduce.run([], self.row_helper(sf), ffgs))
    end
  end

  def self.row_helper(sf)
    lambda do |acc, ele|
      fv = FormValue.find_by(submitted_form_id: sf.id, form_field_id: ele[:ids])
      fv_label = self.form_value_label(fv, ele)
      aps = ele[:assignment_property_types].map do |apt|
        if fv.present? and fv.form_value_option.present?
          ap = AssignmentProperty.find_by(
            assignment_id: fv.form_value_option.assignment_id,
            assignment_property_type_id: apt.id
          )
          ap.present? ? ap.value : nil
        else
          nil
        end
      end
      acc.concat([fv_label]).concat(aps)
    end
  end

  def self.form_value_label(fv, ele)
    if fv.present?
      if ele[:field_type].present?
        self.send(ele[:field_type], fv)
      elsif ele[:assignment_type].present?
        self.send('assignment', fv)
      else
        nil
      end
    else
      nil
    end
  end

  def self.string(fv)
    fv.string_value
  end

  def self.text(fv)
    fv.text_value
  end

  def self.boolean(fv)
    fv.boolean_value
  end

  def self.assignment(fv)
    if fv.form_value_option.nil?
      puts "WARN : form_value missing form_value_option"
      nil
    elsif fv.form_value_option.assignment
      fv.form_value_option.assignment.name
    else
      puts "WARN : form_value_option missing assignment"
      nil
    end
  end

  def self.option(fv)
    x = fv.form_value_option
    x.present? ? x.value : nil
  end

  def self.time(fv)
    dt1 = fv.datetime_value
    dt2 = (dt1.to_time - 5.hours).to_datetime
    final = "#{dt2.strftime('%m/%d/%Y')} #{dt2.strftime('%H:%M %p')}"
    final
  end
end
