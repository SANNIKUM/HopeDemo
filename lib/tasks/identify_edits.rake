namespace :edits do
  desc 'identify edits'

  task :identify => :environment do
    identify_edits
  end


  def identify_edits
    ff = FormField.find_by name: 'clientId'
    fvs = FormValue.where(form_field: ff)
    fvs.each do |fv|
      client_id = fv.string_value
      all_fvs = fvs.where(string_value: client_id)
      all_sfs = SubmittedForm.where(id: all_fvs.map(&:submitted_form_id))
      resolve_edits(all_sfs)
    end
  end

  def resolve_edits(submitted_forms)
    ff = FormField.find_by(name: 'submittedAt')
    fvs = FormValue.where(submitted_form: submitted_forms, form_field: ff)
    fv = fvs.max_by{ |fv| fv.datetime_value }
    sf = fv.submitted_form
    helper(sf, true)
    submitted_forms.where.not(id: sf.id).each{ |sf1| helper(sf1, false) }
  end


  def helper(submitted_form, boolean)
    ff = FormField.find_or_create_by(name: 'isMostRecentVersion', field_type: 'boolean')
    fv = FormValue.find_or_create_by(form_field: ff, boolean_value: boolean, submitted_form: submitted_form)
  end
end
