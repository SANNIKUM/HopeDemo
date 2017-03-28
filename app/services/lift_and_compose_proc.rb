module LiftAndComposeProc

  def self.proc(*modules)
    new_procs = Map.run(self.lift_proc, modules)
    self.compose_proc(*new_procs)
  end

  private

  def self.lift_proc
    lambda do |m_or_p|
      lambda do |hash|
        hash.merge(Caller.run(m_or_p, hash))
      end
    end
  end

  def self.compose_proc(*procs)
    ComposeProc.proc(*procs)
  end
end
