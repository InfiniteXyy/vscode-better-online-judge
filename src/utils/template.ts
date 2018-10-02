export function generateTemplate(language: string) {
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
        case "c":
            return `#include <stdio.h>

solve() {

}
            
int main() {
    int T;
    scanf("%d", &T)
    for (int i = 0; i < T; ++i) {
        solve();
    }
    return 0;
}`;
        default:
            throw new Error("language not support!")
    }
}
