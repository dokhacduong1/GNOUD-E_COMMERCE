interface TreeNode {
    ID: number;
    ParentID?: number;
    children: TreeNode[];
    // Thêm các thuộc tính khác của item ở đây nếu cần
  }
  
export const createTree = (arr: TreeNode[]): TreeNode[] => {
    const treeMap: { [key: number]: TreeNode } = {}; // Sử dụng một bản đồ để theo dõi các nút bằng id
    const tree: TreeNode[] = []; // Mảng chứa cây kết quả
   
    // Tạo một mục nhập trong bản đồ cho mỗi nút và sắp xếp lại arr theo id
    arr.forEach((item) => {
      treeMap[item.ID] = item;
      treeMap[item.ID].children = [];
    });
  
    // Duyệt qua lại arr để xây dựng cây và cập nhật mảng tree
    arr.forEach((item) => {
      const parent = treeMap[item.ParentID];
      if (parent) {
        parent.children.push(treeMap[item.ID]);
      } else {
        tree.push(treeMap[item.ID]);
      }
    });
  
    return tree;
  };