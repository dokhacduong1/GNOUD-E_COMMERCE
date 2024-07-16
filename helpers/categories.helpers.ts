import { deleteQuery } from "../find-record/delete_query";
import Categorie from "../models/categorie.model";
import Trash from "../models/trash.model";

export async function handleDeleteAll(ids: number[]) {
    for (let id of ids) {
      const record = await Categorie.findByPk(id, {
        raw: true,
      });
      await Trash.create({
        TableName: "categories",
        DataTable: JSON.stringify(record),
      });
      await deleteQuery("categories", id);
    }
  }