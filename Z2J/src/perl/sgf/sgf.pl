my %tree;

while (<>) {
  my $node = \%tree;
  while (/(\w\d\w\d)/g) {
     my $move = $1;
     if (!$node->{$move}) {
        $node->{$move} = {};
     }
     $node = $node->{$move};
  }
}

sub out {
  my ($p, $node) = @_;
  my $n = keys %$node;
  foreach my $key (keys %$node) {
     if ($n > 1) {
         print "(";
     }
     print ";$p\[$key\]";
     my $e = 'W';
     if ($p eq $e) {
        $e = 'B';
     }
     out($e, $node->{$key});
     if ($n > 1) {
         print ")";
     }
  }
}

print "(";
out('W', \%tree);
print ")\n";
