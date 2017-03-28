module SoftDeleteSubmittedForm

  def self.run(client_id)
    ff = FormField.find_by(name: 'clientId')
    fvs = FormValue.where(form_field: ff, string_value: client_id)
    sfs = SubmittedForm.where(id: fvs.map(&:submitted_form_id))
    
    ff1 = FormField.find_or_create_by(name: 'isSoftDeleted', field_type: 'boolean')
    sfs.each do |sf|
      fv = FormValue.find_or_create_by(form_field_id: ff1.id, submitted_form_id: sf.id)
      fv.update(boolean_value: true)
    end
    return sfs.any?
  end
end
