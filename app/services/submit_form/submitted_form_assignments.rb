module SubmitForm::SubmittedFormAssignments

  def self.run(sf_id)
    fvs = FormValue.where(submitted_form_id: sf_id)
    fvos = FormValueOption.where(id: fvs.map(&:form_value_option_id))
    fvos.map(&:assignment_id).compact.uniq
  end

end
