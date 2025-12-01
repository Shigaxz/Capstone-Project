import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { Memory, MemoryDocument } from './schemas/memory.schema';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MemoriesService {

  constructor(
    @InjectModel(Memory.name)
    private readonly memoryModel: Model<MemoryDocument>,
  ) {}

  // Crea una nueva memoria
  async create(createMemoryDto: CreateMemoryDto): Promise<Memory> {
    const newMemory = new this.memoryModel(createMemoryDto);
    return newMemory.save();
  }

  // Obtiene todas las memorias
  async findAll(): Promise<Memory[]> {
    return this.memoryModel.find().exec();
  }
  // Obtiene una memoria por id
  async findOne(id: string): Promise<Memory> {
    const memory = await this.memoryModel.findById(id).exec();
    if (!memory) {
      throw new NotFoundException(`Memoria con ID '${id}' no encontrada.`);
    }
    return memory;
  }

  // Editar una memoria
  async update(id: string, updateMemoryDto: UpdateMemoryDto): Promise<Memory> {
    // No se maneja la modificacion de imagenes
    const updatedMemory = await this.memoryModel
      .findByIdAndUpdate(id, updateMemoryDto, { new: true })
      .exec();

    if (!updatedMemory) {
      throw new NotFoundException(`Memoria con ID '${id}' no encontrada.`);
    }
    return updatedMemory;
  }

  // Eliminamos una memoria
  async remove(id: string): Promise<void> {
    const memory = await this.findOne(id);
    await this.memoryModel.deleteOne({ _id: id }).exec();
  }

  async generateMemoryPDF(id: string): Promise<Buffer> {
  const memory = await this.memoryModel.findById(id).exec();
  if (!memory) {
    throw new NotFoundException('Memoria no encontrada');
  }
  
  const templatePath = join(process.cwd(), 'templates', 'memoria.hbs');
  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateHtml);
  const html = template(memory.toJSON());

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px',
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

}

