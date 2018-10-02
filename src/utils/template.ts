export function generateTemplate(language: "cpp" | "c") {
  switch (language) {
    case "cpp":
      return `#include <iostream>
#include <cstring>
#include <algorithm>
using namespace std;


void solve() {
   
}

int main() {
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        solve();
    }
    return 0;
}`;
    default:
      return "";
      break;
  }
}
