import { Request, Response } from 'express';
import { pool } from '../conf/dbConnection';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Validaciones auxiliares
const isValidId = (idStr: string): boolean => {
  const num = Number(idStr);
  return Number.isInteger(num) && num > 0;
};

const isValidPrice = (price: any): boolean => {
  const num = Number(price);
  return !isNaN(num) && num > 0;
};

// 1. Obtener todos (sólo activos)
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE active = TRUE');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. Obtener por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as {id:string};
    if (!isValidId(id)) {
      res.status(400).json({ error: 'El ID debe ser un entero positivo' });
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ? AND active = TRUE',
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado o inactivo' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. Crear producto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, stock, description, brand, img } = req.body;

    if (!name || !price || stock === undefined || !description) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    if (!isValidPrice(price)) {
      res.status(400).json({ error: 'El precio debe ser un número mayor a cero' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO products (name, price, stock, description, brand, img, active) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
      [name, price, stock, description, brand || null, img || null]
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      productId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 4. Actualización completa
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as {id:string};
    if (!isValidId(id)) {
      res.status(400).json({ error: 'El ID debe ser un entero positivo' });
      return;
    }

    const { name, price, stock, description, brand, img } = req.body;

    if (!name || !price || stock === undefined || !description) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    if (!isValidPrice(price)) {
      res.status(400).json({ error: 'El precio debe ser un número mayor a cero' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE',
      [name, price, stock, description, brand || null, img || null, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado o inactivo' });
      return;
    }

    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 5. Baja lógica
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as {id:string};
    if (!isValidId(id)) {
      res.status(400).json({ error: 'El ID debe ser un entero positivo' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado o ya inactivo' });
      return;
    }

    res.json({ message: 'Producto dado de baja lógicamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 6. Modificar sólo precio
export const changePrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as {id:string};
    if (!isValidId(id)) {
      res.status(400).json({ error: 'El ID debe ser un entero positivo' });
      return;
    }

    const { price } = req.body;
    if (!isValidPrice(price)) {
      res.status(400).json({ error: 'El precio proporcionado no es válido' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
      [price, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado o inactivo' });
      return;
    }

    res.json({ message: 'Precio actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};