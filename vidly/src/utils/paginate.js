import _ from "lodash";

export function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;

  // lodash входные итемс, начинаем резать с стартИндекс, берем Сайз или меньше, возвращаем вэлью(обычный массив)
  return _(items)
    .slice(startIndex)
    .take(pageSize)
    .value();
}
