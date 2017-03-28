module SubmitForm::CollectAssignmentIds

  def self.run(sf_id)
    seed_context_ids = self.seeds(sf_id)
    self.context_inference(seed_context_ids)
  end

  private

  def self.seeds(sf_id)
    SubmitForm::SubmittedFormAssignments.run(sf_id)
  end

  def self.context_inference(*args)
    ContextInference::Main.run(*args)
  end
end
