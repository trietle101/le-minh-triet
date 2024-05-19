//Loop
var sum_to_n_a = function (n) {
  //initile sum
  var sum = 0;
  //for loop from 1 to n
  for (var i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

//Recursion
var sum_to_n_b = function (n) {
  //Stop recursion
  if (n === 1) return 1;

  return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n) {
  //formula: sum to n = (n * (n + 1)) / 2
  var sum = (n * (n + 1)) / 2;
  return sum;
};
console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
