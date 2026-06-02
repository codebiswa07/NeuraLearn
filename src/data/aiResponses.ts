export function getAIResponse(activeTopic: string, query: string): string {
  if (activeTopic === 'closures') {
    if (query.includes('why') || query.includes('how')) {
      return 'Because inside JavaScript, functions carry an internal slot called [[Scopes]] which holds references to parent execution contexts. Memory persists as long as the child function is reachable!'
    }

    return "Precisely! Variables from the outer function stay available inside the closure bubble. Try running the code in the Live Coding console."
  }

  if (activeTopic === 'react') {
    if (query.includes('memo') || query.includes('callback')) {
      return 'React.memo and useCallback help avoid unnecessary re-renders, but only use them when components are heavy or props are causing repeated renders.'
    }

    return "React's virtual tree reconciles quickly, but with good memoization, you can skip unnecessary work and improve performance."
  }

  if (activeTopic === 'dsa') {
    if (query.includes('time') || query.includes('complexity')) {
      return 'Great question. Binary search is O(log N) time and O(1) space because it keeps cutting the search area in half.'
    }

    return 'Think of the array as a searchable range. Each comparison removes half of the remaining possibilities.'
  }

  return "That's an interesting question! Let's think about how it works under the hood."
}