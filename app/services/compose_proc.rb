module ComposeProc

  def self.proc(*procs_or_mods)
    procified = Map.run(self.procify, procs_or_mods)
    self.helper(procified)
  end

  private

  def self.procify
    lambda do |proc_or_mod|
      if proc_or_mod.class.name == "Module"
        result = lambda do |args|
          proc_or_mod.run(args)
        end
      else
        result = proc_or_mod
      end
      result
    end
  end

  def self.helper(procs)
    rest = procs[1..procs.length]
    if rest.length == 0
      final = procs[0]
    else
      final = self.compose_two_procs(procs[0], self.helper(rest))
    end
    final
  end

  def self.compose_two_procs(proc1, proc2)
    lambda do |args|
      x = proc2.call(args)
      proc1.call(x)
    end
  end
end
