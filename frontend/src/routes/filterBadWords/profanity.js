import filter from 'leo-profanity';

export const profanity = (words) => {
filter.list();
filter.clearList();
filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('fr'));
filter.add(filter.getDictionary('ru'));
filter.list();
return filter.clean(words);
};
