export function uniqueByObject(arr: object[]) {
  return arr.filter(
    (obj, index, self) => index === self.findIndex((o) => isEqual(obj, o))
  );
}


function isEqual(obj1: any, obj2: any) {
  // Implement your own object comparison logic here
  return obj1.project_id=== obj2.project_id &&
            obj1.project_name ===obj2.project_name &&
            obj1.status === obj2.status &&
            obj1.color ===  obj2.color;
}


