export function getDefaultTemplate(language: string) {
  let code = "";
  switch (language) {
    case "cpp":
      code += `// {{ title }} - {{ date }}
#include <iostream>
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
      break;
    case "c":
      code += `// {{ title }} - {{ date }}
#include <stdio.h>

void solve() {

}
            
int main() {
    int T;
    scanf("%d", &T);
    for (int i = 0; i < T; ++i) {
        solve();
    }
    return 0;
}`;
      break;
    default:
      throw new Error("language not support!");
  }
  return code;
}
