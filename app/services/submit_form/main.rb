module SubmitForm::Main

  def self.run(data)
    ComposeProc.proc(
      self.collect_ui_package,
      self.switch_based_check_out,
      self.automatic_assignment_form_value,
      self.automatic_assignments,
      self.persist_form
    ).call(data)
  end

  private

  def self.collect_ui_package
    SubmitForm::CollectUiPackage::Main
  end

  def self.switch_based_check_out
    SubmitForm::SwitchBasedCheckOut::Main
  end

  def self.automatic_assignment_form_value
    SubmitForm::AutomaticAssignmentFormValue
  end

  def self.automatic_assignments
    SubmitForm::AutomaticAssignments::Main
  end

  def self.persist_form
    SubmitForm::PersistForm::Main
  end
end
